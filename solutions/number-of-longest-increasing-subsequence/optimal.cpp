class Solution {
public:
    int findNumberOfLIS(vector<int>& nums) {
        int n = nums.size(), maxLen = 0, total = 0;
        vector<int> len(n, 1), cnt(n, 1);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] >= nums[i]) continue;
                if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }   // better: inherit
                else if (len[j] + 1 == len[i]) cnt[i] += cnt[j];                     // tie: add
            }
            if (len[i] > maxLen) { maxLen = len[i]; total = cnt[i]; }
            else if (len[i] == maxLen) total += cnt[i];
        }
        return total;
    }
};
