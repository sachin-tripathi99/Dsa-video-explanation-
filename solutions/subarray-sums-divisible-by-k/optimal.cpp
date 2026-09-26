class Solution {
public:
    int subarraysDivByK(vector<int>& nums, int k) {
        vector<int> count(k, 0);
        count[0] = 1;                                 // the empty prefix
        int run = 0, ans = 0;
        for (int x : nums) {
            run = ((run + x) % k + k) % k;            // non-negative remainder
            ans += count[run];
            count[run]++;
        }
        return ans;
    }
};
