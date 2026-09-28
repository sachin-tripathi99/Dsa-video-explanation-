class Solution {
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        vector<int> vals(nums);
        sort(vals.begin(), vals.end());
        vals.erase(unique(vals.begin(), vals.end()), vals.end());   // rank = index + 1
        vector<int> tree(vals.size() + 1), res(n);
        for (int i = n - 1; i >= 0; i--) {
            int r = lower_bound(vals.begin(), vals.end(), nums[i]) - vals.begin() + 1;
            int c = 0;
            for (int x = r - 1; x > 0; x -= x & -x) c += tree[x];   // seen values with smaller rank
            res[i] = c;
            for (int x = r; x < (int)tree.size(); x += x & -x) tree[x]++;   // record this value
        }
        return res;
    }
};
