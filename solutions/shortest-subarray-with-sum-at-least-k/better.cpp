class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;   // (prefix, index)
        pq.push({0, 0});
        long long P = 0;
        int best = INT_MAX;
        for (int j = 1; j <= (int)nums.size(); j++) {
            P += nums[j - 1];
            while (!pq.empty() && P - pq.top().first >= k) { best = min(best, j - pq.top().second); pq.pop(); }
            pq.push({P, j});
        }
        return best == INT_MAX ? -1 : best;
    }
};
