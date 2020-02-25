var express = require('express');
var freeBBSModel = require('../models').free_bbs;
var freeCommentModel = require('../models').free_comments;
var router = express.Router();

/**
 * /get_title_list
 * @returns 에러코드 or 게시글 전체 조회
 */
router.get('/get_title_list', async (req, res, next) => {
    const freeBBS = await freeBBSModel.findAll({
     attributes: ['id', 'title', 'writer_id', 'write_date'],
     order: [['write_date','DESC']]
    });
    try {
        res.send({ freeBBS });
    } catch (error) {
        console.log(error);
        res.send({
            error:true,
            errorCode:1
        });
    }
});

/**
 * /get_contents
 * @param id 게시글 아이디 
 * @returns 에러코드 or 해당 게시글의 상세 내용들 
 */
router.post('/get_contents', async (req, res, next) => {
    const id = req.body.id; // 게시물 id
    console.log(id);
    if (!id) {
      return res.send({ error: true, errorCode: 2 })
    }
  
    try {
        const bbsContents = await freeBBSModel.findAll(
            {
                where: {id: id},
                attributes: ['contents', 'writer_id', 'write_date'],
            }
        );
        const commentContents = await freeCommentModel.findAll(
            {
                where: {body_id: id},
                attributes: ['contents', 'writer_id', 'write_date'],
            }
        );
        if (!bbsContents) // 없는 게시물일 때
            return res.send({ error: true, errorCode: 3 })
        else {
            res.send({ bbsContents, commentContents });
        }
    } catch (error) {
        console.error(error);
        res.send({ error: true, errorCode: 4 })
    }
});



module.exports = router;