class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        deque<int> mx, mn;                                  // indices
        int l = 0, best = 0;
        for (int r = 0; r < (int)nums.size(); r++) {
            while (!mx.empty() && nums[mx.back()] <= nums[r]) mx.pop_back();   // decreasing
            mx.push_back(r);
            while (!mn.empty() && nums[mn.back()] >= nums[r]) mn.pop_back();   // increasing
            mn.push_back(r);
            while (nums[mx.front()] - nums[mn.front()] > limit) {
                l++;
                if (mx.front() < l) mx.pop_front();
                if (mn.front() < l) mn.pop_front();
            }
            best = max(best, r - l + 1);
        }
        return best;
    }
};
