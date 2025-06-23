import { S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import { PutObjectCommand } from "@aws-sdk/client-s3"; // Import the command for uploading files
// uploading to amazon s3

export async function POST(request) {
    const data = await request.formData();

    if (data.has('file')) {
        const file = data.get('file');
        const s3Client = new S3Client({
            region: 'us-east-2',
            credentials: {
                accessKeyId: process.env.ZHICHENG_AWS_ACCESS_KEY,
                secretAccessKey: process.env.ZHICHENG_AWS_SECRET_KEY,     
            },
        });

        const ext = file.name.split('.').slice(-1)[0];
        const newFileName = uniqid() + '.' + ext;

        console.log('Uploading file to S3:', newFileName);
        
        const chunks = [];
        for await (const chunk of file.stream()) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        const bucketName = 'zhicheng-ordering-app';
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFileName,
            ACL: 'public-read',
            ContentType: file.type,
            Body: fileBuffer,
        }))

        return Response.json({
            message: "File uploaded successfully",
            fileUrl: `https://${bucketName}.s3.amazonaws.com/${newFileName}`,
        });

    }
    return Response.json({ message: "POST request received" });
}