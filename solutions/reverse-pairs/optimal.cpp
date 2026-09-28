class Solution {
public:
    int reversePairs(vector<int>& nums) {
        vector<long long> vals(nums.begin(), nums.end());
        sort(vals.begin(), vals.end());
        vals.erase(unique(vals.begin(), vals.end()), vals.end());   // rank = index + 1
        vector<int> tree(vals.size() + 1);
        int count = 0;
        for (int j = 0; j < (int)nums.size(); j++) {
            int k = upper_bound(vals.begin(), vals.end(), 2LL * nums[j]) - vals.begin();   // vals ≤ 2x
            int below = 0;
            for (int x = k; x > 0; x -= x & -x) below += tree[x];
            count += j - below;                                 // earlier values above 2x
            int r = upper_bound(vals.begin(), vals.end(), (long long)nums[j]) - vals.begin();
            for (int x = r; x < (int)tree.size(); x += x & -x) tree[x]++;
        }
        return count;
    }
};
