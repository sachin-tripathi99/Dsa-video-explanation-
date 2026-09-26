class Solution {
public:
    void reorderList(ListNode* head) {
        vector<ListNode*> nodes;
        for (ListNode* p = head; p; p = p->next) nodes.push_back(p);
        int l = 0, r = nodes.size() - 1;
        while (l < r) {
            nodes[l]->next = nodes[r];
            l++;
            if (l == r) break;
            nodes[r]->next = nodes[l];
            r--;
        }
        nodes[l]->next = nullptr;
    }
};
