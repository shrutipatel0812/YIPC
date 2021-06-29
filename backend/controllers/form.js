export const getDetails = async (req, res) => {
    try{
        const allDetails = await form.find();

        res.status(200).json(allDetails);
    }
    catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createDetails =async (req, res) => {
    const form = req.body;

    const newForm = new form (form);
    try {
       await newDetails.save();
       res.status(201).json(newDetails);
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}