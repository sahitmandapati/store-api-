const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort().select('name price')
  
  res.status(200).json({ products, nhHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured , company , name , sort , fields  } = req.query;

  const queryObject = {};

  //featured is string 

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company){
    queryObject.company = company
  }
  
  if(name){
    queryObject.name = { $regex: name, $options: 'i' }
  }



  let result = Product.find(queryObject);

  if(sort){
    // sort = 'name,-price'
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  }else{
    result = result.sort('createdAt')
  }

  if(fields){
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10


  const skip = (page-1) * limit

  result = result.skip(skip).limit(limit)
  // 23 products
  // 4 - pages -> 7 7 7 2
   
 
  const products =  await result

  res.status(200).json({ products, nhHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
