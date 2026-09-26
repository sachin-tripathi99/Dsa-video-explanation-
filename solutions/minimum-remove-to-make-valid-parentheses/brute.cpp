class Solution {
    bool valid(const string& t) {
        int bal = 0;
        for (char c : t) {
            if (c == '(') bal++;
            else if (c == ')' && --bal < 0) return false;
        }
        return bal == 0;
    }
public:
    string minRemoveToMakeValid(string s) {
        set<string> level = {s};
        while (true) {                                      // BFS by number of removals
            for (auto& t : level) if (valid(t)) return t;
            set<string> next;
            for (auto& t : level)
                for (size_t i = 0; i < t.size(); i++)
                    if (t[i] == '(' || t[i] == ')') next.insert(t.substr(0, i) + t.substr(i + 1));
            level = next;
        }
    }
};
