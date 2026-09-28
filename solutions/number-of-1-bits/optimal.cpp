class Solution {
public:
    int hammingWeight(int n) {
        unsigned x = n;
        int count = 0;
        while (x) {
            x &= x - 1;                                     // drop the lowest set bit
            count++;
        }
        return count;
    }
};
