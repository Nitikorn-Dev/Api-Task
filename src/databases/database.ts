import mongoose from 'mongoose';
import { isObjectBindingPattern } from 'typescript';

const config = {

    autoIndex: true,
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
}
const connectionString = `mongodb+srv://nitikorn:OBqzX0ShmKjATNhn@cluster0.xen3b.mongodb.net/task?retryWrites=true&w=majority`;

try {
    mongoose.connect(connectionString, config)
    console.log('connect to MogoDB')
} catch (error) {
    console.log('can not connect to MogoDB', error)
}


const ObjectId = mongoose.Types.ObjectId;

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["TODO", "IN PROGRESS", "COMPLETE"],
        default: "TODO"
    },
    // Comments:{
    //     type:[ObjectId],
    //     ref:"Comment"
    // },
    // createdBy:{
    //     type:ObjectId,
    //     ref:"User"
    // }
},
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

const createTask = async () => {
    const task = new Task({
        title: 'Task 2',
        description: "discription 2",
        status: "IN PROGRESS"
    });
    try {
        const res = await task.save();
        console.log('Create Tesk Success', res);
        return res;
    } catch (error) {
        console.log('Can not Create Task', error);
    }
}

createTask()
    .then((data) => console.log('Then', data))
    .catch(console.log)

module.exports = Task;