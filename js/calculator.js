const display = document.getElementsByClassName("display")[0];

const buttons = Array.from(document.getElementsByClassName("button")); 

var args = [];

buttons.forEach(button => 
{
    button.onclick = () =>
    {
        buttonInput(button);
    }
});

function buttonInput(button)
{
    // 0 - 9 (and .)
    if (button.id >= 0 && button.id <= 9 || button.id == ".")
    {
        addInput(button.id);
    }

    // operators
    if (button.id == "/" || button.id == "*" || button.id == "-" || button.id == "+")
    {
        // if clicked button is active
        if (button.classList.contains("active"))
        {
            button.classList.remove("active");

            args.pop();
        }
        // if clicked button is not active
        else
        {
            // if there are other active buttons
            if (hasActiveOperators())
            {
                clearOperators();

                args.pop();

                button.classList.add("active");

                args.push(button.id);
            }

            else
            {
                if (args[args.length - 1] != display.innerHTML)
                {
                    args.push(display.innerHTML);
                }
            
                clearOperators();

                button.classList.add("active");

                let lastArg = args.pop();
                if (lastArg != "/" && lastArg != "*" && lastArg != "-" && lastArg != "+")
                {
                    args.push(lastArg);
                }

                args.push(button.id);
            }
        }
    }

    // equals
    if (button.id == "=")
    {
        if (hasActiveOperators())
        {
            clearOperators();
            args.pop();
        }
        else
        {
            args.push(display.innerHTML);
            calculate(args);
        }
    }

    // clear
    if (button.id == "CLEAR")
    {
        // user wants to completely clear calculator
        if (display.innerHTML == "0" && !hasActiveOperators())
        {
            clearOperators();
            args = [];
            display.innerHTML = "0";
            return;
        }

        display.innerHTML = "0";
        
        // user wants to clear current arg following an operator
        if (!hasActiveOperators())
        {
            let lastArg = args.pop();
            if (lastArg == "/" || lastArg == "*" || lastArg == "-" || lastArg == "+")
            {
                document.getElementById(lastArg).classList.add("active");
                args.push(lastArg);
            }
        }
    }

    // percentage
    if (button.id == "%")
    {
        display.innerHTML = parseFloat(display.innerHTML) * 0.01;
    }
}

function addInput(input)
{
    // if there are active operators
    if (hasActiveOperators())
    {
        display.innerHTML = input;

        clearOperators();
    }
    // if there are no active operators
    else 
    {
        if (display.innerHTML == "0" || "")
        {
            display.innerHTML = input;
        }
        else
        {
            display.innerHTML += input;
        }
    }
}

function clearOperators()
{
    const activeOperators = Array.from(document.getElementsByClassName("active"));

    activeOperators.forEach(activeOperator => 
    {
        activeOperator.classList.remove("active");
    });
}

function hasActiveOperators()
{
    if (Array.from(document.getElementsByClassName("active")).length > 0)
    {
        return true;
    }

    else
    {
        return false;
    }
}

function calculate(args_)
{
    var md_signs = [];
    var as_signs = [];

    let ans;

    // ORDER OF OPERATIONS - PEMDAS (no P and E in this case)

    // MD
    args_.forEach(arg =>
    {
        if (arg == "*" || arg == "/")
        {
            md_signs.push(arg);
        }
    });

    md_signs.forEach(sign =>
    {
        // M (*)
        if (sign == "*")
        {
            index = args.indexOf("*");
            ans = args_[index - 1] * args_[index + 1];

            args_.splice(index - 1, 3);
            args_.splice(index - 1, 0, ans + "");
        }

        // D (/)
        else if (sign == "/")
        {
            let index = args_.indexOf("/");

            // divide by zero error
            if (args_[index + 1] == 0)
            {
                display.innerHTML = "DIVISION BY ZERO ERROR";
                return;
            }

            ans = args_[index - 1] / args_[index + 1];

            args_.splice(index - 1, 3);
            args_.splice(index - 1, 0, ans + "");
        }
    });

    // AS
    args_.forEach(arg =>
    {
        if (arg == "+" || arg == "-")
        {
            as_signs.push(arg);
        }
    });

    as_signs.forEach(sign =>
    {
        // M (*)
        if (sign == "+")
        {
            let index = args_.indexOf("+");
            ans = parseFloat(args_[index - 1]) + parseFloat(args_[index + 1]);

            args_.splice(index - 1, 3);
            args_.splice(index - 1, 0, ans + "");
        }

        // D (/)
        else if (sign == "-")
        {
            let index = args_.indexOf("-");
            ans = parseFloat(args_[index - 1]) - parseFloat(args_[index + 1]);

            args_.splice(index - 1, 3);
            args_.splice(index - 1, 0, ans + "");
        }
    });

    // DISPLAY ANSWER
    display.innerHTML = args_[0];
    args = [];
}