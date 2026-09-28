class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;                       // columns that carry
            a ^= b;                                         // sum without carries
            b = carry;
        }
        return a;
    }
}
