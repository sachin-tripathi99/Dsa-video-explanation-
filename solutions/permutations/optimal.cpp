class Solution {
    vector<vector<int>> out;
    vector<int> path;
    vector<bool> used;
    void go(vector<int>& nums) {
        if (path.size() == nums.size()) { out.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true; path.push_back(nums[i]);        // choose
            go(nums);                                       // explore
            path.pop_back(); used[i] = false;               // un-choose
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        used.assign(nums.size(), false);
        go(nums);
        return out;
    }
};
