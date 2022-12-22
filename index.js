const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    
    const type = '.png';
    const name = event.Records[0].s3.object.key;
    const size = event.Records[0].s3.object.size;
    const imageObject = { type, name, size };
    console.log('image object', imageObject)
    
    let images = [];
    
    let params = { 
        Bucket: '401js-msd-bucket-demo', 
        Key: 'images.json' 
    };
    
    try {
        
        let data = await s3.getObject(params).promise();
        images = JSON.parse(data.Body.toString());
        
        console.log('images array', images)
        
    } catch(e) { 
        
        console.log(e.message);
        
    }
    
    images.push(imageObject);
    params.Body = JSON.stringify(images);
    
    try {
        await s3.putObject(params).promise();
    } catch(e) {
        console.log(e.message);
    }
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Bucket Update Successful'),
    };
    return response;
};
