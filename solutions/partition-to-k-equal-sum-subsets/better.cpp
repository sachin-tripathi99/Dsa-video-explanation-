class Solution {
    bool assign(vector<int>& a, int i, vector<int>& buckets, int target) {
        if (i == (int)a.size()) return true;
        unordered_set<int> tried;                           // skip buckets with an equal sum
        for (int j = 0; j < (int)buckets.size(); j++) {
            if (buckets[j] + a[i] > target || tried.count(buckets[j])) continue;
            tried.insert(buckets[j]);
            buckets[j] += a[i];
            if (assign(a, i + 1, buckets, target)) return true;
            buckets[j] -= a[i];
        }
        return false;
    }
public:
    bool canPartitionKSubsets(vector<int>& nums, int k) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % k) return false;
        sort(nums.rbegin(), nums.rend());                   // place big numbers first
        if (nums[0] > sum / k) return false;
        vector<int> buckets(k, 0);
        return assign(nums, 0, buckets, sum / k);
    }
};
