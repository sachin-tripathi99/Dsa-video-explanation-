class Solution {
public:
    int hammingWeight(int n) {
        unsigned x = n;
        int count = 0;
        for (int i = 0; i < 32; i++) count += (x >> i) & 1;   // test every bit
        return count;
    }
};
