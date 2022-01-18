// Node Imports
import { Router, Request, Response } from 'express';
// Own Imports
import { requireAuth } from '../../users/routes/auth.router';
import { FeedItem } from '../models/FeedItem';
import * as AWS from '../../../../aws';

// Create router
const router: Router = Router();

/**
 * GET ALL FEED ITEMS 
 * Iterate them and get signed-url for each of them
 */
router.get('/', async (req: Request, res: Response) => {
    // Get feeds and signed-url
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
        if(item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    // Response
    res.send(items);
});

/**
 * GET FEED ITEM
 * Returning its signed-url in S3
 */
router.get('/:id', async (req: Request, res: Response) => {
    // Search feed
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'Id is mandatory'});
    const feed = await FeedItem.findByPk(id);
    if (!feed) return res.status(404).send({ message: `Feed with id ${id} not found` });
    // Get signed-url
    feed.url = AWS.getGetSignedUrl(feed.url);
    // Response
    res.status(200).send(feed);
});

/**
 * UPDATE FEED ITEM
 * Call this function to update the caption or filename in the bucket. In case the file
 * is updated you need to call this method after uploading the new object to S3 bucket
 * body : {caption: string, fileName: string};
 */ 
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
    // Search feed
    const { id } = req.params;
    if (!id) return res.status(500).send({ message: 'Id is mandatory to update a feed'});
    const feed = await FeedItem.findByPk(id);
    if (!feed) return res.status(404).send({ message: `Feed with id ${id} not found` });
    // Update and get signed-url
    const caption = req.body.caption;
    const fileName = req.body.url;
    if (caption) feed.set({caption: caption});
    if (fileName) feed.set({url: fileName});
    const saved_item = await feed.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    // Response
    res.status(201).send(saved_item);
});

/**
 * POST FEED ITEM (after a file is uploaded)
 * body : {caption: string, fileName: string};
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
    // New feed
    const caption = req.body.caption;
    const fileName = req.body.url;
    if (!caption) return res.status(400).send({ message: 'Caption is required or malformed' });
    if (!fileName) return res.status(400).send({ message: 'File url is required' });   
    const item = await new FeedItem({
        caption: caption,
        url: fileName
    });   
    // Save and get signed-url
    const saved_item = await item.save();   
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    // Response
    res.status(201).send(saved_item);
});

/**
 * Get a signed url to put a new item in the bucket
 */
 router.get('/signed-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

/**
 * Get a signed url to retrieve an existing item in the bucket
 */
 router.get('/get-signed-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getGetSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Export
export const FeedRouter: Router = router;