





export default app => {
  app.use((req, res, next) => {
    
    print('yes')
    next()
  })
}