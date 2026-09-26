class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        int n = nums.size(), best = nums[0] + nums[1] + nums[2];
        for (int i = 0; i < n - 2; i++) {
            int l = i + 1, r = n - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (abs(s - target) < abs(best - target)) best = s;
                if (s < target) l++;
                else if (s > target) r--;
                else return s;                      // cannot get closer than exact
            }
        }
        return best;
    }
};
