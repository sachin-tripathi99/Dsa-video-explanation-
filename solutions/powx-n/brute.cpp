class Solution {
public:
    double myPow(double x, int n) {
        long long N = llabs((long long) n);   // |-2^31| does not fit in int
        double result = 1.0;
        for (long long i = 0; i < N; i++) result *= x;
        return n < 0 ? 1.0 / result : result;
    }
};
