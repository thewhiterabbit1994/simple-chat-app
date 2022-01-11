import User from '@models/user'

const temporaryUserHolder = {}

export default {
  Query: {
    doSomeMagic: () => 'abracadabra'
  },
  Mutation: {
    login_signup_attemp: async (_, {PhoneNumber}) => {
      try {
        const doesUserExist = await User.checkIfUserExists(PhoneNumber)

        let thisUser;

        //  login logic
        if (doesUserExist) {
          thisUser = await User.findOne({ PhoneNumber })
          thisUser._createLoginObject()
          return {
            msg: 'ok',
            status: 200
          }
        }

        // signup logic
        thisUser = new User({
          name,
          email,
          phoneNumber,
          isActive: false
        })

        thisUser._createLoginObject()

        temporaryUserHolder[PhoneNumber] = thisUser
        setTimeout(() => delete temporaryUserHolder[PhoneNumber], 200 * 1000) 

        return {
          msg: 'ok',
          status: 200
        }


      } catch (error) {
        throw error
      }
    },
    login_singup_final: async (_, { PhoneNumber, code }) => {
      
      try {

        const isLogin = !temporaryUserHolder[PhoneNumber]

        let thisUser;

        // login logic
        if (isLogin) {
          thisUser = await User.findOne({ PhoneNumber })
          await thisUser._validatCode(code)

          thisUser._clearLoginObject()
          thisUser = await thisUser.save()
  
          const token = thisUser._createToken()

          return {
            token
          }
        }


        // signup logic
        thisUser = temporaryUserHolder[PhoneNumber]
        
        await thisUser._validatCode(code)
        
        thisUser.isActive = true

        thisUser._clearLoginObject()
        thisUser = await thisUser.save()

        const token = thisUser._createToken()
        delete temporaryUserHolder[PhoneNumber]

        // after we log in, the front-end handles storing this token somewhere like 
        // cookies, asyncStorage, etc.
        return {
          token
        }

        
      } catch (error) {
        throw error
      }
    }
  }
}