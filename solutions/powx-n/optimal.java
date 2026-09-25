class Solution {
    public double myPow(double x, int n) {
        long N = Math.abs((long) n);
        double result = 1.0;
        while (N > 0) {
            if ((N & 1) == 1) result *= x;   // this bit of n is set
            x *= x;                          // x, x^2, x^4, x^8, ...
            N >>= 1;
        }
        return n < 0 ? 1.0 / result : result;
    }
}
