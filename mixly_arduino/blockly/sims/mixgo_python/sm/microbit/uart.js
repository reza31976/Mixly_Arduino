var sm_uart = function(name) {
    var mod = {
        'data': {
            'baudrate': mbData.uart.baudrate,
            'bits': mbData.uart.bits,
            'parity': mbData.uart.parity,
            'stop': mbData.uart.stop,
            'tx': mbData.uart.tx,
            'rx': mbData.uart.rx,
            'buffer': mbData.uart.buffer,
            'peer': true
        }
    };
    sm.uart.data = mod.data;

    var init = function(baudrate, bits, parity, stop, tx, rx) {
        if(baudrate === undefined)
            baudrate = Sk.builtin.int_(9600);
        if(bits === undefined)
            bits = Sk.builtin.int_(8);
        if(parity === undefined)
            parity = Sk.builtin.none;
        if(stop === undefined)
            stop = Sk.builtin.int_(1);
        if(tx === undefined)
            tx = Sk.builtin.none;
        if(rx === undefined)
            rx = Sk.builtin.none;
        mod.data.baudrate = baudrate.v;
        mod.data.bits = bits.v;
        mod.data.parity = parity.v;
        mod.data.stop = stop.v;
        mod.data.tx = tx.v;
        mod.data.rx = rx.v;
        mod.data.buffer = "";
        if (mod.data.baudrate == sm.uart.peer.baudrate) {
            mod.data.peer = true;
        }
    }

    init.co_varnames = ['baudrate', 'bits', 'parity', 'stop', 'tx', 'rx'];
    init.$defaults = [Sk.builtin.int_(9600), Sk.builtin.int_(8), Sk.builtin.none, Sk.builtin.int_(1), Sk.builtin.none, Sk.builtin.none];
    init.co_numargs = 6;
    mod.init = new Sk.builtin.func(init);

    mod.any = new Sk.builtin.func(function() {
        return Sk.builtin.bool(mod.data.buffer.length > 0);
    });

    var read = function(){
        if (!mod.data.peer) {
            return;
        }
        if (mod.data.buffer.length > 0) {
            var content = mod.data.buffer;
            mod.data.buffer = "";
            return Sk.builtin.str(content);
        }    
        return Sk.builtin.none;
    }

    var readline = function(){
        if (!mod.data.peer) {
            return;
        }
        if (mod.data.buffer.length > 0) {
            var idx = mod.data.buffer.indexOf('\r');
            if (idx != -1) {
                var content = mod.data.buffer.substring(0, idx + 1);
                mod.data.buffer = mod.data.buffer.substring(idx + 1);;
                return Sk.builtin.str(content);
            }
        }
        return Sk.builtin.none;
    }

    var write = function(message){
        if (!mod.data.peer) {
            return;
        }
        sm.uart.write(message.v);
    }

    mod.read = new Sk.builtin.func(read);
    mod.readline = new Sk.builtin.func(readline);
    mod.write = new Sk.builtin.func(write);

    return mod;
}