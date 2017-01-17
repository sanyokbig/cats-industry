export const Bit = Bit || {};

Bit.mask = (num,mask)=>{
    return ((num & mask) === mask);
}