class Solution {
public:
    int kthGrammar(int n, int k) {
        return __builtin_popcount(k - 1) % 2;   // each 1 bit = one "right" step = one flip
    }
};
