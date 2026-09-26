class Solution {
public:
    ListNode* deleteMiddle(ListNode* head) {
        int n = 0;
        for (ListNode* p = head; p; p = p->next) n++;
        if (n == 1) return nullptr;
        ListNode* p = head;
        for (int i = 0; i < n / 2 - 1; i++) p = p->next;
        p->next = p->next->next;
        return head;
    }
};
