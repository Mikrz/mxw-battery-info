# MXW Battery Report

Uses `node-hid` to display battery percentage. (And also a dump of capability info to be decoded later).

Supports raw output (only battery percentage) with `-r` or `--raw` flags.

Supports debug output with `-d` or `--debug` flags.

Outputs -1 in the event no supported device is detected.

Clone the repo somewhere, and run `npm install` in the directory. Then you can run the script with `node <path to script>/get_battery_percentage.js`.

If you have not setup udev rules for your device, the script will print out the likely udev rules you can add to enable non-root functionality.

Currently supports the Model O Wireless and Model D wireless via wired and wireless connections. Other devices can be added by adding their wired/wireless productIDs to the gloriousProductIDs array. PR/Issues are accepted to add these devices for everyone's benefit, though I will be unable to test them.

This is a modified version of [this pastebin script](https://pastebin.com/TQ6L6z3z) found in [this thread](https://github.com/libratbag/libratbag/issues/1172) by [korkje](https://github.com/korkje). Only really did this because I wanted something to work with [polybar](https://github.com/polybar/polybar).
