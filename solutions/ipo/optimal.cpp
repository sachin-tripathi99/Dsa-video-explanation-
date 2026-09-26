class Solution {
public:
    int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
        int n = profits.size();
        vector<pair<int, int>> projects;                    // (capital, profit)
        for (int i = 0; i < n; i++) projects.push_back({capital[i], profits[i]});
        sort(projects.begin(), projects.end());             // locked, by capital
        priority_queue<int> heap;                           // unlocked profits
        int j = 0;
        for (int r = 0; r < k; r++) {
            while (j < n && projects[j].first <= w) heap.push(projects[j++].second);
            if (heap.empty()) break;
            w += heap.top(); heap.pop();
        }
        return w;
    }
};
