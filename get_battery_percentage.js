const HID = require("node-hid");
const os = require("os");

var raw = false;
var debug = false;

if ( process.argv.includes('--raw') || process.argv.includes('-r') ) {
    raw = true;
}

if ( process.argv.includes('--debug') || process.argv.includes('-d') ) {
    debug = true;
}

function rlog(message){
    if (raw) {
        console.log(message);
    }
}

function debug_log(message){
    if (debug){
        console.log(message)
    }
}
debug_log("DEBUG LOGGING ENABLED")
const gloriousVendorID = 0x258a;
const gloriousProductIDs = [0x2011, 0x2012, 0x2022, 0x2023];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const hex = n => {
    const str = n.toString(16);

    return str.length === 1
        ? "0" + str
        : str;
}

const log_bfr = bfr => {
    const top = [];

    for (let i = 0; i < 16; ++i) {
        top.push(i);
    }
    debug_log("\nHex map:")
    debug_log(top.map(hex).join(" "))
    debug_log(top.map(_ => "===").join(""))

    const arr = [[], [], [], [], []];

    for (let i = 0; i < bfr.length; ++i) {
        arr[Math.floor(i / 16)][i % 16] = bfr[i];
    }

    debug_log(arr.map(_ => _.map(hex).join(" ")).join("\n"));
}

(async () => {
    device_info = HID.devices().find(_ =>
        _.vendorId === gloriousVendorID &&
        gloriousProductIDs.includes(_.productId) &&
        _.interface === 2
    );
    debug_log("Detected device:")
    debug_log(device_info);
    try {
        const device = new HID.HID(device_info.path);

        const bfr = Buffer.alloc(65);

        bfr[3] = 0x02;
        bfr[4] = 0x02;
        bfr[6] = 0x83;

        device.sendFeatureReport(bfr);

        await sleep(50);

        const report = device.getFeatureReport(0, 65);

        log_bfr(report);

        percentage = report[8];

        debug_log("\nPretty feature report:")
        debug_log(`${report} \n`);

        if (raw){
            console.log(percentage);
        } else {
            console.log(`Battery: ${percentage}%`);
        }
    } catch (error) {
        if ( error instanceof TypeError ){
            console.log("Likely a udev issue, see error below!");
            console.error(error.message);
            console.log("\nTry adding the following udev rules to /etc/udev/rules.d/<number>-glorious.rules and replug the device\n");
            console.log(`SUBSYSTEM=="input", GROUP="input", MODE="0666"`);
            console.log(`SUBSYSTEM=="usb", ATTRS{idVendor}=="${device_info.vendorId.toString(16)}", ATTRS{idProduct}=="${device_info.productId.toString(16)}", MODE:="666", GROUP="plugdev"`);
            console.log(`KERNEL=="hidraw*", ATTRS{idVendor}=="${device_info.vendorId.toString(16)}", ATTRS{idProduct}=="${device_info.productId.toString(16)}", MODE="0666", GROUP="plugdev"`);
        } else {
            console.error("Unknown error! See error below:");
            console.log(error);
        }
        process.exit(1);
    }
})();
