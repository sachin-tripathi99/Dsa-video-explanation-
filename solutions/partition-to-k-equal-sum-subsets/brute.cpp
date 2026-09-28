class Solution {
    bool assign(vector<int>& a, int i, vector<int>& buckets, int target) {
        if (i == (int)a.size()) {
            for (int b : buckets) if (b != target) return false;
            return true;
        }
        for (int j = 0; j < (int)buckets.size(); j++) {     // try every bucket
            if (buckets[j] + a[i] > target) continue;
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
        vector<int> buckets(k, 0);
        return assign(nums, 0, buckets, sum / k);
    }
};
