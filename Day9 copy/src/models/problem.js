const mongoose = require("mongoose");
const { schema } = require("./user");
const {Schema} = mongoose;


const problemSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    tags:{
        type:[String],
        enum:['array','LinkedList','graph','DP'],
        required: true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true,
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode:[
        {
            language:{
                type:String,
                required:true,
                enum:["c++", "java", "javascript"]
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
                enum:["c++", "java", "javascript"]
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true 
    }

})

const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem;
