class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int n = gas.size();
        for (int s = 0; s < n; s++) {
            int tank = 0;
            bool ok = true;
            for (int k = 0; k < n && ok; k++) {
                int i = (s + k) % n;
                tank += gas[i] - cost[i];
                if (tank < 0) ok = false;
            }
            if (ok) return s;
        }
        return -1;
    }
};
