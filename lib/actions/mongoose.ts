import mongoose from 'mongoose';

let isConnected = false; // to check if mongoose is connected

export const connectedToDb = async () => {
    mongoose.set('strictQuery', true); // this will prevent unknow connect queris

    if(!process.env.MONGODB_URL) return console.log('MONDODB_URL not found');
    if (isConnected) return console.log('Already Connected to MONDODB');

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log('Connected to mognoDB');
    } catch (error) {
        console.log(error);
    }
}