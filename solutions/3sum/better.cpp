class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        set<vector<int>> found;
        for (size_t i = 0; i < nums.size(); i++) {
            unordered_set<int> seen;
            for (size_t j = i + 1; j < nums.size(); j++) {
                int need = -nums[i] - nums[j];
                if (seen.count(need)) {
                    vector<int> t = {nums[i], nums[j], need};
                    sort(t.begin(), t.end());
                    found.insert(t);
                }
                seen.insert(nums[j]);
            }
        }
        return vector<vector<int>>(found.begin(), found.end());
    }
};
