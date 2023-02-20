const {io} = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band( 'Linkin Park' ));
bands.addBand(new Band( 'Todd Terje' ));
bands.addBand(new Band( 'Queen' ));
bands.addBand(new Band( 'Muse' ));

// console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands()); //Emite la lista de bandas al usuario recién conectado

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje:', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
        // io.emit('nuevo-mensaje', 'HEY! desde actualización');
    });

    client.on('vote-band', ( payload ) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', ( payload ) => {
        // const newBand = new Band (payload.name);
        // bands.addBand( newBand );
        // console.log(payload.name); //Recibe el name porque está en el objeto enviado en FLutter
        bands.addBand(new Band( payload.name ));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', ( payload ) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', ( payload ) => {
    //     // io.emit('nuevo-mensaje', payload); //Emite a todos
    //     // console.log('nuevo-mensaje:', payload);
    //     console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al que lo emitió
    // });
});