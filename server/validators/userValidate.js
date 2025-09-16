import yup from 'yup'

export const userSchema = yup.object({
    name: yup
        .string()
        .trim()
        .min(3, 'Username must be atleast of 3 characters')
        .required(),
    email: yup
        .string()
        .email('The email is not valid one')
        .required(),
    password: yup
        .string()
        .min(6, 'Password must be atleast 6 character')
        .required()
})

export const validateUser = (schema) => async (req, res, next) =>{
    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        return res.status(400).json({errors:err.errors})
    }
}