class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        set<vector<int>> found;
        int n = nums.size();
        for (int a = 0; a < n; a++)
            for (int b = a + 1; b < n; b++)
                for (int c = b + 1; c < n; c++)
                    for (int d = c + 1; d < n; d++)
                        if ((long long)nums[a] + nums[b] + nums[c] + nums[d] == target) {
                            vector<int> q = {nums[a], nums[b], nums[c], nums[d]};
                            sort(q.begin(), q.end());
                            found.insert(q);
                        }
        return vector<vector<int>>(found.begin(), found.end());
    }
};
