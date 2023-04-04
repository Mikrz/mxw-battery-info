const HID = require("node-hid");

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

    console.log(top.map(hex).join(" "))
    console.log(top.map(_ => "===").join(""))

    const arr = [[], [], [], [], []];

    for (let i = 0; i < bfr.length; ++i) {
        arr[Math.floor(i / 16)][i % 16] = bfr[i];
    }

    console.log(arr.map(_ => _.map(hex).join(" ")).join("\n"));
}

(async () => {
    device_info = HID.devices().find(_ =>
        _.vendorId === 0x258a &&
        [0x2011, 0x2012, 0x2022, 0x2023].includes(_.productId) &&
        _.interface === 2
    );

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

    console.log(`report:\n ${report} \n`);

    console.log(`Battery: ${percentage}%`);
})();
