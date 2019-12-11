document.getElementById('contentDiv').onscroll = ()=>{
    if(document.getElementById('contentDiv').scrollTop > 30){
        document.getElementById('prodName').style.fontSize = "20px";
        document.getElementById('prodName').style.paddingTop = '5px'
        document.getElementById('prodBrand').style.fontSize = "16px";
        document.getElementById('tagStyle').style.marginBottom = "4px";
    }
    else{
        document.getElementById('prodName').style.fontSize = "2rem";
        document.getElementById('prodName').style.paddingTop = '5px'
        document.getElementById('prodBrand').style.fontSize = "1.5rem";
        document.getElementById('tagStyle').style.marginBottom = "1rem"
    }
}