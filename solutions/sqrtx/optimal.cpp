class Solution {
public:
    int mySqrt(int x) {
        long long lo = 0, hi = x;
        while (lo < hi) {
            long long mid = lo + (hi - lo + 1) / 2; // round up: we move lo = mid
            if (mid * mid <= x) lo = mid;           // 64-bit product
            else hi = mid - 1;
        }
        return (int)lo;
    }
};
