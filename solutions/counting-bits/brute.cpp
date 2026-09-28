class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        for (int i = 0; i <= n; i++)
            for (int x = i; x; x >>= 1) ans[i] += x & 1;    // count each number's bits
        return ans;
    }
};
