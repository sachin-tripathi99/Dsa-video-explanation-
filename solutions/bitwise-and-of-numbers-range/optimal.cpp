class Solution {
public:
    int rangeBitwiseAnd(int left, int right) {
        int shift = 0;
        while (left < right) {                              // drop columns where they may differ
            left >>= 1;
            right >>= 1;
            shift++;
        }
        return left << shift;
    }
};
