#pragma once
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

namespace H {
inline vector<ListNode*> lastNodes;
inline ListNode* list(const vector<int>& vals) {
    ListNode dummy; ListNode* cur = &dummy;
    lastNodes.clear();
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; lastNodes.push_back(cur); }
    return dummy.next;
}
inline ListNode* cycle(const vector<int>& vals, int pos) {
    ListNode* h = list(vals);
    if (pos >= 0 && !lastNodes.empty()) lastNodes.back()->next = lastNodes[pos];
    return h;
}
inline int indexOf(ListNode* n) {
    if (!n) return -1;
    for (size_t i = 0; i < lastNodes.size(); i++) if (lastNodes[i] == n) return (int)i;
    return -2;
}
const int NUL = INT_MIN;
inline TreeNode* tree(const vector<int>& vals) {
    if (vals.empty() || vals[0] == NUL) return nullptr;
    TreeNode* root = new TreeNode(vals[0]);
    queue<TreeNode*> q; q.push(root);
    size_t i = 1;
    while (!q.empty() && i < vals.size()) {
        TreeNode* cur = q.front(); q.pop();
        if (i < vals.size() && vals[i] != NUL) { cur->left = new TreeNode(vals[i]); q.push(cur->left); }
        i++;
        if (i < vals.size() && vals[i] != NUL) { cur->right = new TreeNode(vals[i]); q.push(cur->right); }
        i++;
    }
    return root;
}
inline TreeNode* find(TreeNode* r, int v) {
    if (!r) return nullptr;
    if (r->val == v) return r;
    TreeNode* l = find(r->left, v);
    return l ? l : find(r->right, v);
}

inline string str(const string& s) {
    string o = "\"";
    for (char c : s) {
        if (c == '"') o += "\\\"";
        else if (c == '\\') o += "\\\\";
        else if (c == '\n') o += "\\n";
        else if ((unsigned char)c < 32) { char b[8]; snprintf(b, sizeof b, "\\u%04x", c); o += b; }
        else o += c;
    }
    return o + "\"";
}
inline string ser(int x) { return to_string(x); }
inline string ser(long x) { return to_string(x); }
inline string ser(long long x) { return to_string(x); }
inline string ser(unsigned x) { return to_string(x); }
inline string ser(unsigned long long x) { return to_string(x); }
inline string ser(unsigned long x) { return to_string(x); }
inline string ser(double x) { if (std::isnan(x) || std::isinf(x)) return "null"; char b[64]; snprintf(b, sizeof b, "%.10g", x); return b; }
inline string ser(bool x) { return x ? "true" : "false"; }
inline string ser(char c) { return str(string(1, c)); }
inline string ser(const string& s) { return str(s); }
inline string ser(const char* s) { return str(string(s)); }
inline string ser(ListNode* n) {
    string o = "["; int g = 0; bool first = true;
    while (n && g++ < 100000) { if (!first) o += ","; first = false; o += to_string(n->val); n = n->next; }
    return o + "]";
}
inline string ser(TreeNode* r) {
    vector<string> out; vector<TreeNode*> order{r};
    for (size_t i = 0; i < order.size() && order.size() < 200000; i++) {
        TreeNode* t = order[i];
        if (!t) { out.push_back("null"); continue; }
        out.push_back(to_string(t->val));
        order.push_back(t->left); order.push_back(t->right);
    }
    while (!out.empty() && out.back() == "null") out.pop_back();
    string o = "[";
    for (size_t i = 0; i < out.size(); i++) { if (i) o += ","; o += out[i]; }
    return o + "]";
}
template <class T> string ser(const vector<T>& v);
inline string ser(const vector<bool>& v) { string o = "["; for (size_t i = 0; i < v.size(); i++) { if (i) o += ","; o += v[i] ? "true" : "false"; } return o + "]"; }
template <class T> string ser(const vector<T>& v) {
    string o = "[";
    for (size_t i = 0; i < v.size(); i++) { if (i) o += ","; o += ser(v[i]); }
    return o + "]";
}
inline void emit(const string& id, int t, const string& json) { cout << "@@" << id << "\t" << t << "\t" << json << "\n"; }
}  // namespace H
