class Solution {
    vector<vector<int>> out;
    vector<int> idx;
    void seq(vector<int>& nums) {                           // every sequence of indices
        int n = nums.size();
        if ((int)idx.size() == n) {
            if (set<int>(idx.begin(), idx.end()).size() == (size_t)n) {   // keep only repeat-free ones
                vector<int> p;
                for (int i : idx) p.push_back(nums[i]);
                out.push_back(p);
            }
            return;
        }
        for (int i = 0; i < n; i++) { idx.push_back(i); seq(nums); idx.pop_back(); }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        seq(nums);
        return out;
    }
};
