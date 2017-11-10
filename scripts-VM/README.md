## Virtual machine
This program executes Assembler language codes and provides the execution result.

------

### Available Commands

1. `ADD`: Sums *add0* with *add1* and puts the result into *add2*. Example:
```ADD 101 102 103```.
2. `JMP`: Moves instruction pointer to a specified register *jmp0*. Example: ```MOV 101```.
3. `JL`: Moves instruction pointer to a specified number *jl0* if CMP is equal to 1. Example: ```JL 100```.
4. `JG`: Moves instruction pointer to a specified number if *jg0* CMP is equal to -1. Example: ```JG 100```.
5. `JE`: Moves instruction pointer to a specified number *je0* if CMP is equal to 0. Example: ```JE 100```.
6. `CMP`: Updates the CMP register with new value using this rule:
    * *cmp0* = *cmp1* -> **cmp** = 0
    * *cmp0* < *cmp1* -> **cmp** = 1
    * *cmp0* > *cmp1* -> **cmp** = -1
    
    Example: ```CMP 100 101```.
7. `MOV`: Puts a number or another register *mov0* value into specified register *mov1*. Example: ```MOV 100 101```.
8. `MUL`: Multiplies *mul0* with *mul1* and puts the result into *mul2*. Example: ```MUL 100 101 102```.
9. `RD`: Reads the next argument and puts it into specified register *rd0*. **Note**: an error would occur if not enough arguments were specified to a program.
10. `WR`: Writes the plain number/string or value from specified register *wr0*. Example: ```WR 101```.

-------

### Data Types

There are three types that the program may evaluate:

* **Register reference** is a number. Refers to another memory object and retrieves it to perform an operation. This will fail if no such register exists.
* **Number** is a `&` symbol followed by number. Will be converted to a plain number and passwed as an argument during execution.
* **String** is a `&&` pair followed by text without whitespaces (you can use `_` instead). _This one is available only for `WR` command_.