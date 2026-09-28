class Solution {
public:
    int deleteAndEarn(vector<int>& nums) {
        vector<int> pts(*max_element(nums.begin(), nums.end()) + 1, 0);
        for (int x : nums) pts[x] += x;                     // bucket points by value
        int prev2 = 0, prev1 = 0;
        for (int p : pts) {                                 // House Robber over values
            int cur = max(prev1, prev2 + p);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};
