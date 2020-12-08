const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Story = require('../models/Story')
const User = require('../models/User')

// @desc Show All Stories
// @route GET /stories
router.get('/',ensureAuth,async(req,res)=>{
    try {
      const stories = await Story.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean()
       res.render('stories/index',{stories})
    } catch (error) {
        console.log(error)
        res.render('stories/index',{displayError: true}) 
       // storyError(true,res)
    }
})

// @desc Show Add Page
// @route GET /stories/add
router.get('/add',ensureAuth,(req,res) => {
    res.render('stories/add')
})


// @desc Show Single Story
// @route GET /stories/:id
router.get('/:id',ensureAuth,async(req,res) => {
    let story;
    try {
        story = await Story.findById(req.params.id).populate('user').lean()
        res.render('stories/show',{
            story
        })
    } catch (error) {
        console.log(error)
        storyError(story,res)
    }
})




// @desc Process add form
// @route POST /stories
router.post('/',ensureAuth, async(req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        storyError(true,res)
    }
})


// @desc Show Edit Page
// @route GET /stories/edit
router.get('/edit/:id',ensureAuth,async(req,res) => {
    let story;
    try {
         story = await Story.findOne({
            _id: req.params.id
        }).lean()
        storyAuthorChecker(story,res,req)
        res.render('stories/edit',{
            story
        })   
    } catch (error) {
        console.log(error)
        storyError(story,res)
    }
})


// @desc  Update Story
// @route PUT /stories/:id
router.put('/:id',ensureAuth,async(req,res) => {
    try {
        const story = await Story.findById(req.params.id).lean()
         storyAuthorChecker(story,res,req)
         await Story.findOneAndUpdate({_id: req.params.id},req.body,{
             new: true,
             runValidators: true
         })
         res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        storyError(true,res)
    }
})


// @desc Delete Page
// @route DELETE /stories/:id
router.delete('/:id',ensureAuth,async(req,res) => {
    try {
      const story = await Story.findById(req.params.id).lean()
      storyAuthorChecker(story,res,req)
      await Story.findByIdAndDelete({_id: req.params.id})
      res.redirect('/')
    } catch (error) {
        console.log(error)
        storyError(true,res)
    }
})

// @desc User Stories
// @route GET /stories/user/:userId
router.get('/user/:userId',ensureAuth,async(req,res) => {
    let user;
    try {
        user = await User.findOne({
            _id: req.params.userId
        }).lean()
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()
        res.render('stories/index',{
            stories,
            userProfile: true,
            user
        })
    } catch (error) {
        console.log(error)
        storyError(user,res)
    }
})


function storyAuthorChecker(story,res,req){
    if(story.user != req.user.id){
      return res.redirect('/stories')
    }
}

function storyError(story,res){
    if(!story){
        return res.render('error/404')
    }
    return res.render('error/500')
}


module.exports = router
