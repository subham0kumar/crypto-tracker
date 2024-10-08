import React from 'react'
import { makeStyles } from 'tss-react/mui'

const SelectButton = ({children, selected, onClick}) => {

    const useStyles = makeStyles()((theme) => {
        return{
            selectButton: {
                border: "1px solid #d9a8dd",
                borderRadius: 5,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontFamily: "monospace",
                cursor: "pointer",
                backgroundColor: selected ? "#d9a8dd" : "",
                color: selected ? "black" : "",
                fontWeight: selected ? 700 : 500,
                "&:hover": {
                    backgroundColor: "#d9a8dd",
                    color: "black",
                },
                width: "22%",
                margin: 5,
            },
        };
    });
    
    const { classes } = useStyles();
  return (
    <span
        onClick={onClick}
        className={classes.selectButton}>
        {children}
    
    </span>
  )
}

export default SelectButton