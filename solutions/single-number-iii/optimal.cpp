class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        unsigned x = 0;
        for (int y : nums) x ^= y;                          // a ^ b
        unsigned low = x & (~x + 1);                        // a bit where a and b differ
        int a = 0, b = 0;
        for (int y : nums) {
            if ((unsigned)y & low) a ^= y;                  // pairs cancel inside each group
            else b ^= y;
        }
        return {a, b};
    }
};
