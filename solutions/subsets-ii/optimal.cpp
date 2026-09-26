class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(vector<int>& nums, int start) {
        out.push_back(path);
        for (int i = start; i < (int)nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;   // same value, same depth
            path.push_back(nums[i]);
            go(nums, i + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        go(nums, 0);
        return out;
    }
};
